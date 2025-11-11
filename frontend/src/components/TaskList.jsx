import TaskItem from './TaskItem';

function TaskList({ tasks, onDelete, onUpdate }) {
  if (tasks.length === 0) {
    return <p className="empty-list">Nenhuma tarefa cadastrada ainda.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;