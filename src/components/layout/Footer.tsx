import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted text-foreground py-4 mt-5 border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <p className="mb-0 text-muted-foreground text-center">
            &copy; 2025 MerryMeals. Making a difference, one meal at a time.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
