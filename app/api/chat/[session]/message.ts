 import { axiosInstance } from '@/utilities/axios';
import type { NextApiRequest, NextApiResponse } from 'next';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req,'req2');
  
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { session_id } = req.query;
  const { message } = req.body;

  try {
    const response = await axiosInstance.post(`/api/chat/${session_id}/message`, { message });
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
  }
}
