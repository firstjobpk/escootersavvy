import React, { useState } from 'react';
import { Battery, BatteryWarning, Zap, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
}

const diagnosticQuestions: Question[] = [
  {
    id: 'charging',
    text: 'How long does it typically take to fully charge your battery?',
    options: [
      'Less than 3 hours (Normal)',
      '3-5 hours (Slightly Longer)',
      'More than 5 hours (Significantly Longer)',
      'Battery won\'t charge at all',
      'Not sure'
    ]
  },
  {
    id: 'range',
    text: 'Have you noticed a decrease in range per charge?',
    options: [
      'No decrease',
      'Slight decrease (10-20%)',
      'Significant decrease (>30%)',
      'Severe decrease (>50%)',
      'Not applicable'
    ]
  },
  {
    id: 'performance',
    text: 'How would you describe the vehicle\'s performance?',
    options: [
      'Normal power and acceleration',
      'Slightly reduced power',
      'Significant power loss',
      'Intermittent power cutouts',
      'Complete loss of power'
    ]
  },
  {
    id: 'physical',
    text: 'Are there any physical signs of battery damage?',
    options: [
      'No visible issues',
      'Swelling or deformation',
      'Unusual heat during use/charging',
      'Leakage or corrosion',
      'Not sure'
    ]
  }
];

function App() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setShowResults(false);
  };

  const calculateScore = (): number => {
    const scoreMap: Record<string, number> = {
      'Less than 3 hours (Normal)': 25,
      'No decrease': 25,
      'Normal power and acceleration': 25,
      'No visible issues': 25
    };

    return Object.values(answers).reduce((score, answer) => {
      return score + (scoreMap[answer] || 0);
    }, 0);
  };

  const getDiagnosis = (score: number): {
    summary: string;
    recommendations: string[];
    severity: 'critical' | 'warning' | 'good';
  } => {
    if (score >= 90) {
      return {
        summary: 'Battery health is excellent',
        recommendations: ['Continue regular maintenance', 'Monitor charging patterns'],
        severity: 'good'
      };
    } else if (score >= 60) {
      return {
        summary: 'Battery showing signs of wear',
        recommendations: [
          'Schedule a diagnostic check',
          'Monitor charging times',
          'Consider optimizing usage patterns'
        ],
        severity: 'warning'
      };
    } else {
      return {
        summary: 'Battery requires immediate attention',
        recommendations: [
          'Contact dealer for inspection',
          'Avoid deep discharges',
          'Consider battery replacement',
          'Check charging system'
        ],
        severity: 'critical'
      };
    }
  };

  const resetForm = () => {
    setAnswers({});
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const score = calculateScore();
  const diagnosis = getDiagnosis(score);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Battery className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Battery Health Monitor
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and diagnose your e-vehicle battery health
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
          {diagnosticQuestions.map((question) => (
            <div key={question.id} className="space-y-4">
              <label className="text-lg font-medium text-gray-900">
                {question.text}
              </label>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={`${question.id}-${option}`}
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`${question.id}-${option}`}
                      className="ml-3 text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={Object.keys(answers).length < diagnosticQuestions.length}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
                disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Generate Diagnosis
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 
                flex items-center justify-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </button>
          </div>
        </form>

        {showResults && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Diagnosis Results</h2>
              <div className="flex items-center">
                <BatteryWarning className={`w-6 h-6 ${
                  diagnosis.severity === 'critical' ? 'text-red-500' :
                  diagnosis.severity === 'warning' ? 'text-yellow-500' :
                  'text-green-500'
                }`} />
                <span className="ml-2 text-2xl font-bold">{score}/100</span>
              </div>
            </div>

            <div className={`p-4 rounded-md mb-4 ${
              diagnosis.severity === 'critical' ? 'bg-red-50 text-red-800' :
              diagnosis.severity === 'warning' ? 'bg-yellow-50 text-yellow-800' :
              'bg-green-50 text-green-800'
            }`}>
              {diagnosis.summary}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recommendations:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {diagnosis.recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;