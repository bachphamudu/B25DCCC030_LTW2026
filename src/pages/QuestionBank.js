import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [filterType, setFilterType] = useState('all'); 
  const [sortType, setSortType] = useState('id'); 
  const [searchTerm, setSearchTerm] = useState('');

  const totalCount = questions.length;
  const officialCount = questions.filter((q) => !q.reserve).length;
  const reserveCount = questions.filter((q) => q.reserve).length;

  const filteredQuestions = questions.filter((q) => {
    const matchFilter =
      filterType === 'all' ||
      (filterType === 'official' && !q.reserve) ||
      (filterType === 'reserve' && q.reserve);

    const matchSearch = q.question
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    return matchFilter && matchSearch;
  });

  const displayedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortType === 'asc') {
      return a.level - b.level || a.id - b.id;
    }
    if (sortType === 'desc') {
      return b.level - a.level || a.id - b.id;
    }
    return a.id - b.id;
  });

  const getBtnStyle = (type) => ({
    backgroundColor: filterType === type ? 'orange' : '#f0f0f0',
    color: filterType === type ? 'white' : 'black',
    border: '1px solid #ccc',
  });

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <div style={{ marginBottom: '12px' }}>
        <button style={getBtnStyle('all')} onClick={() => setFilterType('all')}>
          {`Tất cả (${totalCount})`}
        </button>
        <button style={getBtnStyle('official')} onClick={() => setFilterType('official')}>
          {`Chính thức (${officialCount})`}
        </button>
        <button style={getBtnStyle('reserve')} onClick={() => setFilterType('reserve')}>
          {`Dự bị (${reserveCount})`}
        </button>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          style={{ marginLeft: '12px', padding: '6px' }}
        >
          <option value="id">Theo số thứ tự</option>
          <option value="asc">Mức độ: Dễ → Khó</option>
          <option value="desc">Mức độ: Khó → Dễ</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: '12px', padding: '6px' }}
        />
      </div>

      <p>{`Có ${displayedQuestions.length} câu hỏi`}</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Loại</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {displayedQuestions.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{q.reserve ? 'Dự bị' : 'Chính thức'}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;