import React from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'

// list todos
const GET_TODOS = gql`
  query getTodos {
    todos {
      done
      id
      text
    }
  }
`

// toggle todos
const TOOGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`
// add todos
const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`
// delete todos
const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
        id
        text
      }
    }
  }
`

function App() {
  // state
  const [todoText, setTodoText] = React.useState('')
  // apollo/client
  const { data, loading, error } = useQuery(GET_TODOS)
  const [toggleTodo] = useMutation(TOOGLE_TODO)
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText(''),
  })
  const [deleteTodo] = useMutation(DELETE_TODO)

  // functions
  async function handleToggleTodo(todo) {
    const data = await toggleTodo({
      variables: { id: todo.id, done: !todo.done },
    })
    console.log('toggled todo', data)
  }

  async function handleAddTodo(event) {
    event.preventDefault()
    if (!todoText.trim()) return
    const data = await addTodo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_TODOS }],
    })
    console.log('added todo', data)
    // setTodoText('')
  }

  async function handleDeleteTodo({ id }) {
    const isConfirmed = window.confirm('Do you want to delete this todo?')
    if (isConfirmed) {
      const data = await deleteTodo({
        variables: { id },
        update: (cache) => {
          const prevData = cache.readQuery({ query: GET_TODOS })
          const newTodos = prevData.todos.filter((todo) => todo.id !== id)
          cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } })
        },
      })
      console.log('deleted todo', data)
    }
  }

  if (loading) return <div>Loading todos...</div>
  if (error) return <div>Error fetching todos!</div>

  return (
    <div className='vh-100 code flex flex-column items-center bg-purple white pa3 fl-1'>
      <h1 className='f2-l'>
        GraphQL Checklist{' '}
        <span role='img' aria-label='Checkmark'>
          ✔️
        </span>
      </h1>
      {/* todo form */}
      <form onSubmit={handleAddTodo} className='mb3'>
        <input
          className='pa2 f4'
          type='text'
          placeholder='Write your todo'
          onChange={(event) => setTodoText(event.target.value)}
          value={todoText}
        />
        <button className='pa2 f4 bg-green white' type='submit'>
          Create
        </button>
      </form>
      {/* todo list */}
      <div className='flex items-center justify-center flex-column'>
        {data.todos.map((todo) => (
          <p onClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer pa1 f3 ${todo.done && 'strike'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo)}
              className='bg-transparent bn f4'
            >
              <span className='red'>&times; </span>
            </button>
          </p>
        ))}
      </div>
    </div>
  )
}

export default App
