'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ToDo {
  ToDoId: number;
  Title: string;
  Description: string;
  DueDateTime?: string;
  Priority?: string;

}

export default function BucketTasksPage() {
  const router = useRouter();
  const params = useParams();
  const bucketId = params?.bucketId;
  const [tasks, setTasks] = useState<ToDo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          router.push('/login');
          return;
        }
        const res = await fetch(
          `https://hrms-backend-mv05.onrender.com/todos/bucket/${bucketId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    if (bucketId) fetchTasks();
  }, [bucketId, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-blue-100 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8 text-center drop-shadow">Tasks in Bucket #{bucketId}</h1>
        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500">No tasks found for this bucket.</div>
        ) : (
          <ul className="space-y-6">
            {tasks.map((task) => (
              <li key={task.ToDoId} className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl transition-all duration-200">
                <h2 className="font-bold text-xl text-purple-700 mb-2">{task.Title}</h2>
                <p className="text-gray-700 mb-2">{task.Description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                  <span className="bg-blue-50 px-3 py-1 rounded-full">Due: {task.DueDateTime ? new Date(task.DueDateTime).toLocaleDateString() : 'N/A'}</span>
                  <span className="bg-purple-50 px-3 py-1 rounded-full">Priority: {task.Priority}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
