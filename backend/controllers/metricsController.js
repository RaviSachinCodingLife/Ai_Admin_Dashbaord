import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getMetrics = async (req, res) => {
  res.json([
    { name: 'Users', value: 1200 },
    { name: 'Revenue', value: 5400 },
    { name: 'Active Sessions', value: 300 },
  ]);
};

export const explainMetric = async (req, res) => {
  try {
    const { metricName, value } = req.body;
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Explain what ${metricName} with value ${value} means in business context.`,
        },
      ],
    });

    res.json({ explanation: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
