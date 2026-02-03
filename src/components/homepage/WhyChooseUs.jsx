import React from 'react'
import { ReactComponent as Puzzle } from '../../assets/puzzle9.svg'
import groupImg from '../../assets/group.png'
import tingkatanImg from '../../assets/tingkatan.png'
import diskusiImg from '../../assets/diskusi.png'
import FeatureCard from './FeatureCard'

const features = [
  {
    icon: groupImg,
    title: 'Real Experience in Team!',
    description: "You'll experience working in a professional team, from discussions and assignments to project completion. Every step is executed collaboratively to achieve the best results and provide relevant work experience."
  },
  {
    icon: diskusiImg,
    title: 'Supportive Discussion Environment!',
    description: "We provide a comfortable environment for discussion, exchange of ideas, and collaborative learning. Within this team, every opinion is valued, and you'll receive ongoing support to develop your understanding and skills."
  },
  {
    icon: tingkatanImg,
    title: 'Team Skill Development!',
    description: "You'll not only work in a team, but also grow alongside them. Through collaboration, you'll improve your communication, problem-solving, and coordination skills, which are crucial in the workplace."
  }
]

export default function WhyChooseUs() {
  return (
    <section className="mt-44 mb-20 space-y-12">
      <div className="flex items-start justify-between gap-6">
        <div className="md:flex-1 min-w-0 pr-4">
          <h3 className="text-4xl font-bold mb-4">Why Choose Us!</h3>
          <p className="text-slate-300 leading-relaxed">
            because by joining this team, you will get real experience working on team projects, having a discussion team,
            having a new and supportive environment
          </p>
        </div>

        <div className="flex-shrink-0 ml-4 transform translate-y-8 md:-translate-y-6 lg:-translate-y-3" style={{ width: 'clamp(64px, 20vw, 110px)' }}>
          <Puzzle className="w-full h-auto text-white/90" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  )
}
