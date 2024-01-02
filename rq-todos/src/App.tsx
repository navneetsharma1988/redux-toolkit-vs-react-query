import React, { useRef } from "react";
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { getTodos, Todo, updateTodo, deleteTodo, createTodo  } from "./lib/api";

const queryClient = new QueryClient();


function TodoApp() {
  const { data: todos } = useQuery<Todo[]>("todos", getTodos, {
    initialData: [],
  });

  const textRef = useRef<HTMLInputElement>(null);

  const updateMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const deleteMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const createMutation = useMutation(createTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });



  return (
    <div className="App">
      <div className="todos">
        {todos?.map((todo) => (
          <React.Fragment key={todo.id}>
            <div>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => {
                  updateMutation.mutate({ ...todo, done: !todo.done });
                }}
              />
              <span>{todo.text}</span>
            </div>
            <button
              onClick={() => {
                deleteMutation.mutate(todo);
              }}
            >
              Delete
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className="add">
        <input type="text" ref={textRef} />
        <button
          onClick={() => {
            createMutation.mutate(textRef.current!.value ?? "");
            textRef.current!.value = "";
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function App() {
  

  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}


export default App;
