import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface TeamMember {
  name: string
  avatar: string
  bio: string
  github: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Daniel Callaghan',
    avatar: 'https://avatars.githubusercontent.com/u/84312595?s=128&v=4',
    bio: 'I like coding with javascript and python.',
    github: 'https://github.com/xiaoniuniu89'
  },
  {
    name: 'Leyla Adhar',
    avatar: 'https://avatars.githubusercontent.com/u/227037726?s=128&v=4',
    bio: 'Currently evolving tech knowledge with HTML, CSS, JavaScript, and learning Python & Django.',
    github: 'https://github.com/laylaadhar879-ops'
  },
  {
    name: 'Sefa Keles',
    avatar: 'https://avatars.githubusercontent.com/u/91561217?s=128&v=4',
    bio: 'Web developer passionate about building creative applications.',
    github: 'https://github.com/Sefa-Keles'
  }
]

const Home: React.FC = () => {
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <header id="header">
        <div className="container mx-auto px-4 flex flex-grow py-4">
          <div className="flex flex-wrap items-center flex-grow w-full -mx-4">
            <div className="header-info w-full md:w-1/2 px-4">
              <h1>Discover Delicious Recipes</h1>
              <p className="text-lg text-muted-foreground my-4">
                Explore our collection of amazing recipes and help donate meals to those in need.
              </p>
              <div className="flex gap-2">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                  <Link to="/recipes" aria-label="Visit recipes page">
                    Browse Recipes
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/contact" aria-label="Visit contact page">
                    Get In Touch
                  </Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4 py-4">
              <img
                src="/public/christmas recipe header image.webp"
                className="w-full h-auto rounded-lg"
                alt="Festive holiday meal with Christmas-themed recipes"
              />
            </div>
          </div>
        </div>
      </header>

      <main id="main">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="pt-4">
              <div className="intro-cover text-center">
                <i className="fa-solid fa-kitchen-set fa-4x text-burgundy" aria-hidden="true"></i>
                <div className="pt-8">
                  <h2 className="font-script text-4xl">Easy Recipes</h2>
                  <p>Simple, step-by-step instructure for every skill level.</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <div className="intro-cover text-center">
                <i className="fa-solid fa-hand-holding-heart fa-4x text-burgundy" aria-hidden="true"></i>
                <div className="pt-8">
                  <h2 className="font-script text-4xl">Donate Meals</h2>
                  <p>Every recipe can help feed someone in need.</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <div className="intro-cover text-center">
                <i className="fa-solid fa-user-plus fa-4x text-burgundy" aria-hidden="true"></i>
                <div className="pt-8">
                  <h2 className="font-script text-4xl">Follow Us</h2>
                  <p>Connect with us on social media</p>
                  <div className="flex justify-center gap-3 mt-3">
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit our Facebook page"
                      className="text-burgundy hover:text-antique-gold transition-colors"
                    >
                      <i className="fa-brands fa-facebook-f fa-lg" aria-hidden="true"></i>
                    </a>
                    <a
                      href="https://x.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit our X page"
                      className="text-burgundy hover:text-antique-gold transition-colors"
                    >
                      <i className="fa-brands fa-x-twitter fa-lg" aria-hidden="true"></i>
                    </a>
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit our Instagram page"
                      className="text-burgundy hover:text-antique-gold transition-colors"
                    >
                      <i className="fa-brands fa-instagram fa-lg" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5">
            <h2 className="font-script text-4xl text-center mb-4">Meet The Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div key={member.name} className="pt-4">
                  <div className="dev-card-content text-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="rounded-full mb-3"
                      width="100"
                      height="100"
                    />
                    <h3 className="text-burgundy font-serif font-semibold text-lg">
                      {member.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2">
                      {member.bio}
                    </p>
                    <Button asChild size="sm" className="mt-2 bg-secondary hover:bg-secondary/90">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${member.name.split(' ')[0]}'s Github profile`}
                      >
                        <i className="fab fa-github mr-2" aria-hidden="true"></i> GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
