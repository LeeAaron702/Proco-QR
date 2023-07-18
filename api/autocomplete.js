const autocomplete = async (req, res) => {
    const { input } = req.body;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&components=country:us&types=address`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            res.status(500).json({ error: 'Error fetching autocomplete options' });
            return;
        }

        // Extract the parts of the input string for comparison
        const inputParts = input.toLowerCase().split(' ');

        // Filter the predictions to only include those that contain all parts of the input string
        const filteredPredictions = data.predictions.filter(prediction => {
            const predictionLower = prediction.description.toLowerCase();
            return inputParts.every(part => predictionLower.includes(part));
        });

        // Replace the predictions in the data with the filtered predictions
        data.predictions = filteredPredictions;

        console.log("🚀 ~ file: autocomplete.js ~ autocomplete ~ data:", data)
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching autocomplete options' });
    }
};

export default autocomplete;
