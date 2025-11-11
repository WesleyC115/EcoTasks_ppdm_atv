function TaskItem({ task, onDelete, onUpdate }) {
  // A classe CSS muda com base no status [cite: 19]
  const itemClassName = task.status ? 'task-item completed' : 'task-item';

  const handleCheckboxChange = () => {
    // Chama a função de update (de App.jsx)
    onUpdate(task.id, task.status);
  };

  const handleDeleteClick = () => {
    // Chama a função de delete (de App.jsx)
    onDelete(task.id);
  };

  return (
    <div className={itemClassName}>
      <div className="task-info">
        <input
          type="checkbox"
          checked={task.status}
          onChange={handleCheckboxChange}
        />
        <div>
          <h3>{task.titulo}</h3>
          <span className="task-category">{task.categoria}</span>
          <span className={task.status ? 'status-completed' : 'status-pending'}>
              {task.status ? 'Concluído' : 'Pendente'}
            </span>
        </div>
      </div>
      <button className="delete-btn" onClick={handleDeleteClick}>
        Excluir
      </button>
    </div>
  );
}

export default TaskItem;