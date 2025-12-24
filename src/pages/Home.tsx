import React from 'react'
import { Link } from 'react-router-dom'

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
      <a href="#main" className="skip-link visually-hidden-focusable">Skip to main content</a>
      <header id="header">
        <div className="container d-flex flex-grow-1 py-4">
          <div className="row align-items-center flex-grow-1 w-100">
            <div className="header-info col-12 col-md-6">
              <h1>Discover Delicious Recipes</h1>
              <p className="lead">Explore our collection of amazing recipes and help donate meals to those in need.</p>
              <Link to="/recipes" className="btn btn-success btn-lg" aria-label="Visit recipes page">
                Browse Recipes
              </Link>
              <Link to="/contact" className="btn btn-outline-success btn-lg ms-2" aria-label="Visit contact page">
                Get In Touch
              </Link>
            </div>
            <div className="header-image col-12 col-md-6 py-4">
              <img
                src="/public/christmas recipe header image.webp"
                className="img-fluid rounded"
                alt="Festive holiday meal with Christmas-themed recipes"
              />
            </div>
          </div>
        </div>
      </header>

      <main id="main">
        <div className="container">
          <div className="row py-4">
            <div className="intro-card">
              <div className="intro-cover text-center">
                <i className="fa-solid fa-kitchen-set fa-4x" aria-hidden="true"></i>
                <div className="card-content">
                  <h2>Easy Recipes</h2>
                  <p>Simple, step-by-step instructure for every skill level.</p>
                </div>
              </div>
            </div>
            <div className="intro-card">
              <div className="intro-cover text-center">
                <i className="fa-solid fa-hand-holding-heart fa-4x" aria-hidden="true"></i>
                <div className="card-content">
                  <h2>Donate Meals</h2>
                  <p>Every recipe can help feed someone in need.</p>
                </div>
              </div>
            </div>
            <div className="intro-card">
              <div className="intro-cover text-center">
                <i className="fa-solid fa-user-plus fa-4x" aria-hidden="true"></i>
                <div className="card-content">
                  <h2>Follow Us</h2>
                  <p>Connect with us on social media</p>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Facebook page"
                  >
                    <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our X page"
                  >
                    <i className="fa-brands fa-x-twitter" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Instagram page"
                  >
                    <i className="fa-brands fa-instagram" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="dev-section py-5">
            <h2 className="text-center mb-4">Meet The Team</h2>
            <div className="dev-cards">
              {teamMembers.map((member) => (
                <div key={member.name} className="dev-card">
                  <div className="dev-card-content text-center">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="rounded-circle mb-3"
                      width="100"
                      height="100"
                    />
                    <h3 style={{ color: 'var(--burgundy)', fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>
                      {member.name}
                    </h3>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {member.bio}
                    </p>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success btn-sm mt-2"
                      aria-label={`Visit ${member.name.split(' ')[0]}'s Github profile`}
                    >
                      <i className="fab fa-github" aria-hidden="true"></i> GitHub
                    </a>
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
