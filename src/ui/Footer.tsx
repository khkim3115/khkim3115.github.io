// 하단: 만든 사람 GitHub 링크.
const GITHUB_PROFILE_URL = 'https://github.com/khkim3115';

export function Footer() {
  return (
    <footer className="footer">
      <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
        GitHub · khkim3115
      </a>
    </footer>
  );
}
