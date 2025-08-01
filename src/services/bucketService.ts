import axios from 'axios';

const API_URL = "https://hrms-backend-mv05.onrender.com/Bucket";

export interface Bucket {
  BucketId?: number;
  CID?: number;
  BucketName: string;
  BucketDescription?: string;
  created?: Date;
  updated?: Date;
  CreatedBy?: number;
  UpdatedBy?: number;
}

export const createBucket = async (bucket: Partial<Bucket>): Promise<Bucket> => {
  const cid = sessionStorage.getItem('cid');
  const uid = sessionStorage.getItem('uid');
  
  const bucketData = {
    ...bucket,
    CID: cid ? Number(cid) : undefined,
    CreatedBy: uid ? Number(uid) : undefined
  };
  
  const response = await axios.post<Bucket>(API_URL, bucketData);
  return response.data;
};

export const getAllBuckets = async (): Promise<Bucket[]> => {
  const cid = sessionStorage.getItem('cid');
  const response = await axios.get<Bucket[]>(`${API_URL}${cid ? `?cid=${cid}` : ''}`);
  return response.data;
};

export const updateBucket = async (id: number, bucket: Partial<Bucket>): Promise<Bucket> => {
  const uid = sessionStorage.getItem('uid');
  
  const bucketData = {
    ...bucket,
    UpdatedBy: uid ? Number(uid) : undefined
  };
  
  const response = await axios.put<Bucket>(`${API_URL}/${id}`, bucketData);
  return response.data;
};

export async function show() {
  const accessToken = sessionStorage.getItem('accessToken');
  const response = await fetch('https://hrms-backend-production-3091.up.railway.app/bucket', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch buckets');
  }
  return response.json();
}
