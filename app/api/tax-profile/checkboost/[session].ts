import axiosInstance from '@/utilities/axios';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { session_id } = req.query;
  const taxdata = req.body;

  try {
    const response = await axiosInstance.post(`/api/tax-profile/checkboost/${session_id}`, taxdata);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
  }
}
