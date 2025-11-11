function TaskItem({ task, onDelete, onUpdate }) {
  // A classe CSS muda com base no status
  const itemClassName = task.status ? 'task-item completed' : 'task-item';

  const handleCheckboxChange = () => {
    // Chama a função de update (de App.jsx)
    onUpdate(task.id, task.status);
  };

  const handleDeleteClick = () => {
    // Chama a função de delete (de App.jsx)
    onDelete(task.id);
  };

  // Função para formatar a data (opcional, mas melhora a exibição)
  const formatarData = (dataString) => {
    if (!dataString) return null;
    // Converte 'AAAA-MM-DD' para 'DD/MM/AAAA'
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const dataFormatada = formatarData(task.data_tarefa);

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
          
          {/* NOVO: Container para meta-dados (categoria, status, data) */}
          <div className="task-meta">
            <span className="task-category">{task.categoria}</span>
            
            {/* Seu código de status */}
            <span className={task.status ? 'status-completed' : 'status-pending'}>
              {task.status ? 'Concluído' : 'Pendente'}
            </span>

            {/* NOVO: Exibe a data se ela existir */}
            {dataFormatada && (
              <span className="task-date">📅 {dataFormatada}</span>
            )}
          </div>
        </div>
      </div>
      <button className="delete-btn" onClick={handleDeleteClick}>
        Excluir
      </button>
    </div>
  );
}

export default TaskItem;