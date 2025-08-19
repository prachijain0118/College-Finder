import { College } from '../App';

interface CollegeResultsProps {
  colleges: College[];
  searchLocation: string;
  totalCount: number;
  displayCount: number;
  onLoadMore: () => void;
}

const CollegeResults: React.FC<CollegeResultsProps> = ({ 
  colleges, 
  searchLocation, 
  totalCount, 
  displayCount, 
  onLoadMore 
}) => {
  return (
    <div className="college-results">
      <div className="results-header">
        <h2> Premium Colleges in {searchLocation}</h2>
        <div className="results-stats">
          <span className="results-count">
            ✨ Displaying {colleges.length} of {totalCount} premium institution{totalCount !== 1 ? 's' : ''}
          </span>
          {totalCount > displayCount && (
            <span className="results-more">
               {totalCount - displayCount} more excellent options await
            </span>
          )}
        </div>
      </div>

      <div className="colleges-grid">
        {colleges.map((college, index) => (
          <div key={index} className="college-card">
            <div className="college-header">
              <h3 className="college-name">{college.name}</h3>
              <span className={`college-type ${college.type.toLowerCase()}`}>
                {college.type === 'Both' ? 'IT & Management' : college.type}
              </span>
            </div>

            <div className="college-details">
              <div className="detail-section">
                <h4>🏢 Campus Location</h4>
                <p>{college.address}</p>
              </div>

              <div className="detail-section">
                <h4>Get in Touch</h4>
                <div className="contact-info">
                  {college.contactDetails.phone && (
                    <p><strong>📞 Phone:</strong> {college.contactDetails.phone}</p>
                  )}
                  {college.contactDetails.email && (
                    <p><strong>✉️ Email:</strong> 
                      <a href={`mailto:${college.contactDetails.email}`}>
                        {college.contactDetails.email}
                      </a>
                    </p>
                  )}
                  {college.contactDetails.website && (
                    <p><strong>🌐 Website:</strong> 
                      <a href={college.contactDetails.website} target="_blank" rel="noopener noreferrer">
                        🔗 Visit Official Site
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>🎓 Academic Programs</h4>
                <div className="courses-list">
                  {college.coursesAvailable.map((course, courseIndex) => (
                    <span key={courseIndex} className="course-tag">
                      📖 {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>Investment & Fees</h4>
                <div className="fees-table">
                  {college.fees.map((fee, feeIndex) => (
                    <div key={feeIndex} className="fee-row">
                      <span className="fee-course">🎯 {fee.course}</span>
                      <span className="fee-amount">💰 {fee.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayCount < totalCount && (
        <div className="load-more-section">
          <button 
            className="load-more-btn"
            onClick={onLoadMore}
          >
            🌟 Discover More Colleges ({totalCount - displayCount} premium options)
          </button>
        </div>
      )}

      {colleges.length === 0 && (
        <div className="no-results">
          <h3>🔍 No premium institutions found</h3>
          <p>✨ Try exploring a different location or refine your search terms.</p>
        </div>
      )}
    </div>
  );
};

export default CollegeResults;
