import React, { useState } from "react";

type TabItem = {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  defaultTabId?: string;
};

export const Tabs = ({ tabs, defaultTabId }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0].id);

  return (
    <div className="flex flex-col w-full">
      <nav className="mb-6!">
        <ul className="flex! list-none! w-full! p-0! m-0! border! border-(--pico-border-color)! rounded-lg! overflow-hidden!">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <li key={tab.id} className="flex-1! m-0!">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full! m-0! py-2! px-1! text-sm!
                    ${isActive ? "" : "outline secondary"}

                  `}
                >
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${activeTab === tab.id ? "block" : "hidden"}`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};
