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
          `https://hrms-backend-production-3091.up.railway.app/todo/bucket/${bucketId}`,
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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Tasks in Bucket #{bucketId}</h1>
        {loading ? (
          <div>Loading...</div>
        ) : tasks.length === 0 ? (
          <div>No tasks found for this bucket.</div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.ToDoId} className="border rounded p-4">
                <h2 className="font-semibold">{task.Title}</h2>
                <p>{task.Description}</p>
                <div className="text-sm text-gray-500">
                  Due: {task.DueDateTime ? new Date(task.DueDateTime).toLocaleDateString() : 'N/A'} | Priority: {task.Priority}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}