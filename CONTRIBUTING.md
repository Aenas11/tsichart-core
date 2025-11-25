# Contributing to Time Series Interactive Charts (@tsichart-core)

Thank you for your interest in contributing! This is a community-maintained project and we welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, library version)
- **Sample code** demonstrating the issue

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the proposed functionality
- Explain why this enhancement would be useful
- Include examples of how it would be used

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style
- Write clear commit messages
- Update documentation as needed
- Add tests for new functionality
- Ensure all tests pass
- Keep PRs focused - one feature/fix per PR

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/tsichart-core.git
cd tsichart-core

# Install dependencies
npm install

# Start development server
npm start

# Build the library
npm run build
```

## Project Structure

```
src/
  UXClient/
    Components/     # All chart components
    Models/         # Data models
    Utils/          # Utility functions
    Constants/      # Constants and configurations
    Interfaces/     # TypeScript interfaces
```

## Code Style

- This project uses TypeScript
- Follow existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and testable

## Testing

Before submitting a PR:

```bash
# Run all tests
npm test

# Build to check for errors
npm run build
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
