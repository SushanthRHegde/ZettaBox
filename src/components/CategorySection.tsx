
import React from 'react';
import { ChevronRight } from 'lucide-react';
import ToolCard from './ToolCard';

interface Tool {
  title: string;
  description: string;
  icon: any;
  href: string;
  isLocked?: boolean;
}

interface CategorySectionProps {
  title: string;
  viewAllHref: string;
  tools: Tool[];
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  viewAllHref,
  tools,
}) => {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <a
          href={viewAllHref}
          className="text-sm flex items-center text-primary hover:underline"
        >
          View all
          <ChevronRight className="ml-1 h-4 w-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            href={tool.href}
            isLocked={tool.isLocked}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
