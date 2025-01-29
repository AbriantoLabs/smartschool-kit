# Contributing to Smartschool API Client

First off, thank you for considering contributing to the Smartschool API Client! It's people like you that make this tool better for everyone.

## Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following our [commit message conventions](#commit-message-format)
4. Push to your branch
5. Open a Pull Request

## Development Setup

1. Make sure you have [Deno](https://deno.land/) installed
2. Clone your fork of the repository
3. Run tests:
   ```bash
   deno test
   ```

## Project Structure

```
smartschool-client/
├── mod.ts           # Main entry point
├── types.ts         # Type definitions
├── xml.ts          # XML generation utilities
├── cli.ts          # CLI implementation
├── tests/          # Test files
└── examples/       # Example implementations
```

## Coding Standards

### TypeScript Guidelines

- Use TypeScript strict mode
- Provide complete type definitions
- Use interfaces over types where possible
- Document public APIs with JSDoc comments

### Code Style

- Use 2 spaces for indentation
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic

Example:
```typescript
/**
 * Creates a new user in Smartschool
 * @param data User creation data
 * @returns API response
 * @throws SmartschoolError if the API returns an error
 */
async function createUser(data: UserData): Promise<APIResponse> {
  // Implementation
}
```

## Testing

- Write tests for new features
- Update tests for bug fixes
- Run the full test suite before submitting PRs

```typescript
// Example test
Deno.test("saveUser creates new user", async () => {
  // Test implementation
});
```

## Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, missing semi-colons, etc)
- refactor: Code changes that neither fix a bug nor add a feature
- perf: Performance improvements
- test: Adding or updating tests
- chore: Updating build tasks, package manager configs, etc

Example:
```
feat(user): add support for co-accounts

Added support for creating and managing co-accounts in the saveUser method.
Includes new type definitions and documentation updates.

Closes #123
```

## Pull Request Process

1. Update documentation for new features
2. Add or update tests as needed
3. Update the README.md if needed
4. Link to any relevant issues
5. Wait for review from maintainers

## Issue Reporting

### Bug Reports

Include:
- Smartschool API Client version
- Environment details (Deno/Node version, OS)
- Steps to reproduce
- Expected vs actual behavior
- Code examples

Example:
```markdown
### Bug Report

Version: 1.0.0
Environment: Deno 1.37.0, macOS

#### Steps to Reproduce
1. Create client instance
2. Call saveUser with following data...

#### Expected Behavior
User is created

#### Actual Behavior
Receiving error...
```

### Feature Requests

Include:
- Clear use case
- Expected behavior
- Example implementation if possible

## JSR Publishing

For maintainers with publishing rights:

1. Update version in jsr.json
2. Run tests
3. Publish:
   ```bash
   jsr publish
   ```

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Working Together

We aim to maintain a peaceful and constructive environment. If any issues arise, we'll work together to resolve them through open dialogue and mutual understanding. The focus is on learning and growing as a community while maintaining respectful interactions.

## Getting Help

- Open an issue for bugs
- Discussions for general questions
- Pull requests for code changes

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
