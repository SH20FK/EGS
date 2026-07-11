const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Epic Games Store Free Games Proxy Endpoint
app.get('/api/free-games', async (req, res) => {
  try {
    const response = await fetch('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US');
    if (!response.ok) {
      throw new Error(`Epic API returned status ${response.status}`);
    }
    const data = await response.json();
    
    const elements = data?.data?.Catalog?.searchStore?.elements || [];
    const games = [];
    
    for (const item of elements) {
      const promotions = item.promotions;
      if (!promotions) continue;
      
      const isFree = item.price?.totalPrice?.discountPrice === 0 || item.price?.totalPrice?.originalPrice === 0;
      
      const activeOffers = promotions.promotionalOffers?.[0]?.promotionalOffers || [];
      const upcomingOffers = promotions.upcomingPromotionalOffers?.[0]?.promotionalOffers || [];
      
      if (activeOffers.length > 0 || upcomingOffers.length > 0) {
        let status = 'upcoming';
        let startDate = null;
        let endDate = null;
        
        if (activeOffers.length > 0) {
          status = 'active';
          startDate = activeOffers[0].startDate;
          endDate = activeOffers[0].endDate;
        } else if (upcomingOffers.length > 0) {
          status = 'upcoming';
          startDate = upcomingOffers[0].startDate;
          endDate = upcomingOffers[0].endDate;
        }
        
        let image = '';
        if (item.keyImages && item.keyImages.length > 0) {
          const wideImage = item.keyImages.find(img => img.type === 'OfferImageWide' || img.type === 'DieselStoreFrontWide' || img.type === 'Thumbnail');
          image = wideImage ? wideImage.url : item.keyImages[0].url;
        }
        
        games.push({
          id: item.id,
          title: item.title,
          description: item.description,
          slug: item.productSlug || item.catalogNs?.mappings?.[0]?.pageSlug || item.urlSlug,
          image,
          status,
          startDate,
          endDate,
          originalPrice: item.price?.totalPrice?.fmtPrice?.originalPrice || 'Free',
          discountPrice: item.price?.totalPrice?.fmtPrice?.discountPrice || 'Free',
        });
      }
    }
    
    // Sort active first, then upcoming
    games.sort((a, b) => {
      if (a.status === 'active' && b.status === 'upcoming') return -1;
      if (a.status === 'upcoming' && b.status === 'active') return 1;
      return new Date(a.startDate) - new Date(b.startDate);
    });

    res.json({ success: true, games });
  } catch (err) {
    console.error('Error in /api/free-games:', err);
    res.status(500).json({ success: false, error: err.message, games: [] });
  }
});

// Save Workflow File Endpoint
app.post('/api/save-workflow', (req, res) => {
  const { yaml } = req.body;
  if (!yaml) {
    return res.status(400).json({ error: 'No yaml content provided' });
  }
  
  const dirPath = path.join(__dirname, '.github', 'workflows');
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(path.join(dirPath, 'claim-free-games.yml'), yaml, 'utf8');
    res.json({ success: true, message: 'Workflow successfully saved to .github/workflows/claim-free-games.yml' });
  } catch (err) {
    console.error('Error saving workflow:', err);
    res.status(500).json({ error: 'Failed to write workflow file: ' + err.message });
  }
});

// Fallback to serve index.html for SPA router (if any, though we are a single-page layout)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
