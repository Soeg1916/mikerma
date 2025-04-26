import React from 'react';

export default function StatsSection() {
  const stats = [
    {
      value: "100+",
      label: "Happy Customers"
    },
    {
      value: "50+",
      label: "Services Offered"
    },
    {
      value: "99%",
      label: "Satisfaction Rate"
    },
    {
      value: "24/7",
      label: "Customer Support"
    }
  ];

  return (
    <section className="py-12 bg-stats-gradient">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="stats-card p-6 text-center">
              <div className="stats-value mb-2">{stat.value}</div>
              <div className="stats-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}