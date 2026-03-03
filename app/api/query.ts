import { NextApiRequest, NextApiResponse } from "next";
import { default as axios } from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { query } = req.body;

  try {
    const response = await axios.post(`https://amus-devapi.musetax.com/query`, { query });
    res.status(200).json(response.data);
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: error.message });
  }
}
