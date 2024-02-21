import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function RatingReview({ value, onChange }) {
  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onChange(ratingValue)}
              style={{ display: 'none',
              }}
            />
            <FontAwesomeIcon
              icon={faStar}
              color={ratingValue <= value ? '#ffc107' : '#e4e5e9'}
              size="xs"
            />
          </label>
        );
      })}
    </div>
  );
}

export { RatingReview };