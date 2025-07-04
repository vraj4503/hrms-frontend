'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBucket, getAllBuckets, Bucket } from '../../../src/services/bucketService';

export default function BucketsPage() {
  const router = useRouter();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketDescription, setNewBucketDescription] = useState('');
  const [isAddingBucket, setIsAddingBucket] = useState(false);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const fetchBuckets = async () => {
      try {
        const data = await getAllBuckets();
        setBuckets(data);
      } catch (error) {
        // console.error('Error fetching buckets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuckets();
  }, [router]);

  const handleAddBucket = async () => {
    if (!newBucketName.trim()) return;

    setIsAddingBucket(true);
    try {
      const newBucket = await createBucket({
        BucketName: newBucketName,
        BucketDescription: newBucketDescription,
      });
      setBuckets([...buckets, newBucket]);
      setNewBucketName('');
      setNewBucketDescription('');
    } catch (error) {
      // console.error('Error creating bucket:', error);
    } finally {
      setIsAddingBucket(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold shadow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800">Buckets</h1>
          <button
            onClick={() => setIsAddingBucket(!isAddingBucket)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow"
          >
            {isAddingBucket ? 'Cancel Add' : 'Add New Bucket'}
          </button>
        </div>

        {isAddingBucket && (
          <div className="mb-6 p-6 border rounded-2xl bg-gradient-to-br from-white via-green-50 to-blue-50 shadow">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Add New Bucket</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="bucketName" className="block text-sm font-medium text-gray-700">Bucket Name</label>
                <input
                  type="text"
                  id="bucketName"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)}
                  placeholder="Enter bucket name"
                />
              </div>
              <div>
                <label htmlFor="bucketDescription" className="block text-sm font-medium text-gray-700">Bucket Description</label>
                <textarea
                  id="bucketDescription"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newBucketDescription}
                  onChange={(e) => setNewBucketDescription(e.target.value)}
                  placeholder="Enter bucket description"
                ></textarea>
              </div>
              <button
                onClick={handleAddBucket}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow"
              >
                Create Bucket
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading buckets...</div>
        ) : buckets.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No buckets found</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {buckets.map((bucket) => (
              <div
                key={bucket.BucketId}
                className="border rounded-xl p-6 bg-gradient-to-br from-white via-blue-50 to-green-50 hover:shadow-xl transition-shadow cursor-pointer flex flex-col justify-between min-h-[140px]"
                onClick={() => router.push(`/buckets/${bucket.BucketId}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
                      {bucket.BucketName}
                    </h3>
                    <p className="text-gray-600 mt-2">{bucket.BucketDescription}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tasks/add?bucketId=${bucket.BucketId}`);
                      }}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 font-semibold"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 