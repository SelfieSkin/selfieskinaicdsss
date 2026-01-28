
import React from 'react';
import { KNOWLEDGE_BASE_DATA } from '../constants';

const KnowledgeBase: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Clinical Reference Guide</h2>
        <p className="text-gray-600 mb-8">Comprehensive evidence-based guidelines for Botulinum Toxin (BoNT) administration in aesthetic medicine.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KBSection title="Indications for Use" items={KNOWLEDGE_BASE_DATA.indications} color="border-blue-500" />
          <KBSection title="Contraindications" items={KNOWLEDGE_BASE_DATA.contraindications} color="border-red-500" />
          <KBSection title="Common Adverse Events" items={KNOWLEDGE_BASE_DATA.adverseEvents} color="border-amber-500" />
          <KBSection title="Patient Selection Criteria" items={KNOWLEDGE_BASE_DATA.patientSelection} color="border-green-500" />
        </div>
      </section>

      <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3">Pharmacological Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Complex Size</th>
                <th className="px-4 py-2 text-left">Storage</th>
                <th className="px-4 py-2 text-left">Onset</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 font-medium">Botox (Ona)</td>
                <td className="px-4 py-2">900 kDa</td>
                <td className="px-4 py-2">Refrigerated</td>
                <td className="px-4 py-2">3-5 Days</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Dysport (Abo)</td>
                <td className="px-4 py-2">500-900 kDa</td>
                <td className="px-4 py-2">Refrigerated</td>
                <td className="px-4 py-2">1-3 Days</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Xeomin (Inco)</td>
                <td className="px-4 py-2">150 kDa</td>
                <td className="px-4 py-2">Room Temp</td>
                <td className="px-4 py-2">3-4 Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const KBSection: React.FC<{ title: string, items: any[], color: string }> = ({ title, items, color }) => (
  <div className={`bg-white rounded-lg shadow-sm border-l-4 ${color} p-5`}>
    <h3 className="font-bold text-lg mb-4 text-gray-800">{title}</h3>
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx}>
          <h4 className="font-semibold text-gray-700 text-sm mb-1">{item.title}</h4>
          <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default KnowledgeBase;
