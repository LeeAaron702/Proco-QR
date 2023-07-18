const autocomplete = async (req, res) => {
    const { input } = req.body;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&components=country:US`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("🚀 ~ file: autocomplete.js:8 ~ autocomplete ~ data:", data)
      console.log("🚀 ~ file: autocomplete.js:8 ~ autocomplete ~ data.predictions.structured_formatting.main_text:", data.predictions.structured_formatting)
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching autocomplete options' });
    }
  };
  
  export default autocomplete;
  