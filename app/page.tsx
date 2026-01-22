import InteractiveVideoPlayer from '@/components/InteractiveVideoPlayer';
import { sampleQuestions } from '@/data/sampleQuestions';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interactive Learning Video
          </h1>
          <p className="text-lg text-gray-600">
            Phase 1 MVP - Checkpoint Questions Demo
          </p>
        </div>
        
        <InteractiveVideoPlayer
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          captionsUrl="/captions/sample-en.vtt"
          questions={sampleQuestions}
        />
        
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            How It Works
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">▶</span>
              <span>Click play to start the video</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">⏸</span>
              <span>Video pauses automatically at checkpoint questions (10s, 30s, 50s)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Answer correctly to continue (green feedback)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✗</span>
              <span>Incorrect answers show red feedback - try again!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">CC</span>
              <span>Toggle captions on/off</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">🔍</span>
              <span>Zoom effect triggers at 15 seconds</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}