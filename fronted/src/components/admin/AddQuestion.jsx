import  { useState } from "react";
import "./AddQuestion.css";
import api from "../../utils/api";
import { toast } from "react-toastify";

function AddQuestion() {
  const [formData, setFormData] = useState({
    domain: "",
    difficultyTier: "",
    order: "",
    question: "",
    expectedKeywords: ""
  });

  const [loading, setLoading] = useState(false);

  const domains = ["frontend", "backend","full-stack","dsa","DevOps","ML/AI","mobile","system-design"];
  const difficulties = ["beginner", "intermediate", "advanced"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelect = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/api/admin/add-question",
                        {
                          domain: formData.domain,
                          difficultyTier: formData.difficultyTier,
                          order: formData.order ? Number(formData.order) : undefined,
                          question: formData.question,
                          expectedKeywords: formData.expectedKeywords
                            ? formData.expectedKeywords.split(",").map((k) => k.trim())
                            : []
                        }
      );
      toast.success(response.data.message);

      setFormData({
        domain: "",
        difficultyTier: "",
        order: "",
        question: "",
        expectedKeywords: ""
      });
      
    } catch (error) {
       toast.error("somthing went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-question-container">
      <h2>Add Question</h2>

      <form onSubmit={handleSubmit} className="add-question-form">

        {/* Custom Domain Dropdown */}
        <div className="custom-select">
          <div className="select-label">Domain</div>
          <div className="select-options">
            {domains.map((d) => (
              <div
                key={d}
                className={`select-option ${formData.domain === d ? "active" : ""}`}
                onClick={() => handleSelect("domain", d)}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Difficulty Dropdown */}
        <div className="custom-select">
          <div className="select-label">Difficulty</div>
          <div className="select-options">
            {difficulties.map((d) => (
              <div
                key={d}
                className={`select-option ${formData.difficultyTier === d ? "active" : ""}`}
                onClick={() => handleSelect("difficultyTier", d)}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        <input
          type="number"
          name="order"
          placeholder="Order (Optional)"
          value={formData.order}
          onChange={handleChange}
        />

        <textarea
          name="question"
          placeholder="Enter Question"
          value={formData.question}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="expectedKeywords"
          placeholder="Expected Keywords (comma separated)"
          value={formData.expectedKeywords}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={
            loading ||
            !formData.domain ||
            !formData.difficultyTier ||
            !formData.question
          }
        >
          {loading ? "Adding..." : "Add Question"}
        </button>

      </form>
    </div>
  );
}

export default AddQuestion;