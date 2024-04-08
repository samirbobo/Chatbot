export default function SearchIcon({ onClick, className }) {
  return (
    <svg
      onClick={onClick}
      className={`icon ${className && className}`}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 17.5L6.83058 13.1694M6.83058 13.1694C5.69956 12.0384 5 10.4759 5 8.75C5 5.29822 7.79822 2.5 11.25 2.5C14.7018 2.5 17.5 5.29822 17.5 8.75C17.5 12.2018 14.7018 15 11.25 15C9.52411 15 7.96161 14.3004 6.83058 13.1694Z"
        stroke="#A3A7B5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
