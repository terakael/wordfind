# Word Find Puzzle Game

A browser-based word search puzzle game where players find hidden words in a grid.

## Features
- Multiple grid sizes (6x6, 9x9, 12x12)
- Words placed horizontally, vertically, or diagonally
- Visual feedback for selected and found words
- Word list overlay showing words to find
- Responsive design for mobile and desktop
- Dark theme with modern UI

## How to Play
1. Words can be found by selecting adjacent letters
2. Words can be in any direction (left, right, up, down, diagonal)
3. Found words will be highlighted
4. Complete the puzzle by finding all words

## Installation
1. Clone the repository
2. Open `src/index.html` in a web browser

## Development
- Pure HTML/CSS/JavaScript (no external dependencies)
- Edit files in `src/` directory:
  - `index.html` - Main game structure
  - `style.css` - Styling
  - `script.js` - Game logic

## Deployment Options
### Docker
1. Build image: `docker build -t wordfind .`
2. Run container: `docker run -p 8080:80 wordfind`
3. Access at `http://localhost:8080`

### Kubernetes
1. Apply manifests:
   ```bash
   kubectl apply -f manifest/deployment.yaml
   kubectl apply -f manifest/service.yaml
   ```
2. Service exposes the game on port 80

## Screenshot
![Game Screenshot](screenshot.png)