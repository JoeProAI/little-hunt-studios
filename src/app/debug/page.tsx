'use client';

export const dynamic = 'force-dynamic';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
  const { user, userData, refreshUserData } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">User Auth:</h3>
            <pre className="bg-slate-900 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({ 
                uid: user?.uid,
                email: user?.email,
                displayName: user?.displayName,
              }, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-bold mb-2">User Data from Firestore:</h3>
            <pre className="bg-slate-900 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-bold mb-2">Credits:</h3>
            <p className="text-2xl font-bold">{userData?.credits || 0}</p>
          </div>

          <Button onClick={refreshUserData}>
            Refresh User Data
          </Button>

          <div className="pt-4 border-t">
            <h3 className="font-bold mb-2">Instructions to Add Credits:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Copy your UID: <code className="bg-slate-900 px-2 py-1 rounded">{user?.uid}</code></li>
              <li>Go to: <a href="https://console.firebase.google.com/project/little-hunt-studios/firestore/data" target="_blank" className="text-purple-400 underline">Firebase Console</a></li>
              <li>Click on <strong>users</strong> collection</li>
              <li>Find the document with ID: <strong>{user?.uid}</strong></li>
              <li>Click on the document</li>
              <li>Edit the <strong>credits</strong> field and set it to 10</li>
              <li>Click Save</li>
              <li>Come back here and click "Refresh User Data"</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
