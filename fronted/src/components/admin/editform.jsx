import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AddQuestion.css";

function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    domain: "",
    difficultyTier: "",
    order: "",
    question: "",
    expectedKeywords: ""
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/admin/fetch-one/${id}`
        );

        const q = res.data.data;

        setFormData({
          domain: q.domain,
          difficultyTier: q.difficultyTier,
          order: q.order,
          question: q.question,
          expectedKeywords: q.expectedKeywords.join(", ")
        });

      } catch (error) {
        console.log(error);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:4000/api/admin/edit-question/${id}`,
        {
          ...formData,
          order: Number(formData.order),
          expectedKeywords: formData.expectedKeywords
            .split(",")
            .map((k) => k.trim())
        }
      );

      navigate("/admin"); // redirect after update

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-question-container">
      <h2>Edit Question</h2>

      <form onSubmit={handleSubmit} className="add-question-form">

        <input
          type="text"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
        />

        <input
          type="text"
          name="difficultyTier"
          value={formData.difficultyTier}
          onChange={handleChange}
        />

        <input
          type="number"
          name="order"
          value={formData.order}
          onChange={handleChange}
        />

        <textarea
          name="question"
          value={formData.question}
          onChange={handleChange}
        />

        <input
          type="text"
          name="expectedKeywords"
          value={formData.expectedKeywords}
          onChange={handleChange}
        />

        <button type="submit">
          {loading ? "Updating..." : "Update Question"}
        </button>

      </form>
    </div>
  );
}

export default EditForm;