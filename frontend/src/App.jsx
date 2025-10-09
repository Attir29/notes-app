import { useState, useEffect } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState(null); // <-- note aktif (untuk popup)

  const baseUrl = "https://notes-app-nu-wine.vercel.app";

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${baseUrl}/notes`);
      const result = await res.json();
      setNotes(result.data);
    } catch {
      console.log("Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (newTitle, newContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      const result = await res.json();
      if (res.ok) {
        setNotes([...notes, result.data]);
      }
    } catch (error) {
      console.log("Error adding note", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes((notes) => notes.filter((note) => note.id !== id));
        setSelectedNote(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateNote = async (id, updateTitle, updateContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updateTitle,
          content: updateContent,
        }),
      });

      const result = await res.json();

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? result.data : note))
      );
      setSelectedNote(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0a0a0a] text-gray-100 h-fit">
      <Navbar />
      <main className="flex flex-col items-center px-4 sm:px-6 lg:px-8 h-fit min-h-screen pt-52">
        <img src="/title2.svg" alt="" className="w-98 mb-12" />

        <NoteForm onAddNote={addNote} />

        <section className="w-full max-w-[1120px] mb-8">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full border-1 border-[#333333] bg-[#0a0a0a] text-gray-100 focus:border-white transition-all p-3 placeholder-[#]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>

        <NoteList
          notes={filteredNotes}
          onNoteClick={(note) => setSelectedNote(note)}
        />
      </main>

      {/* Popup detail */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={handleUpdateNote}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;

// ================== COMPONENTS ==================

const Navbar = () => (
  <nav className="w-full fixed top-0 z-10 bg-[#0a0a0a] border-b border-[#333333] h-[113px] flex flex-row justify-between items-center">
    <div className="container w-fit h-full p-8 border-r-1 border-[#333333]">
      <img
        src="/app-note-logo-3.svg"
        alt="Logo"
        className="w-9 sm:w-11 md:w-13 object-contain"
      />
    </div>
    <div className="container w-fit h-[112px] p-8 border-l-1 border-[#333333] ">
      <a
        href="https://attirmidzi-personal-web.netlify.app/"
        className="text-2xl"
      >
        personal web
      </a>
    </div>
  </nav>
);

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddNote(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <section className="w-full max-w-2xl mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6">
        <input
          type="text"
          placeholder="Title"
          className="border border-[#333333] bg-[#0a0a0a] text-gray-100 transition-all p-3 placeholder-[#979797]"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="border border-[#333333] bg-[#0a0a0a] text-gray-100 transition-all p-3 min-h-[100px] resize-y placeholder-[#979797]"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-white text-black font-semibold hover:bg-[#e2e2e2] py-3 transition-colors"
        >
          Add Note
        </button>
      </form>
    </section>
  );
};

// CARD PREVIEW
const NoteItem = ({ note, onClick }) => (
  <div
    onClick={() => onClick(note)}
    className="w-full max-w-[260px] h-[200px] bg-[#0a0a0a] border-1 border-[#333333] hover:border-white shadow-lg p-5 flex flex-col justify-between  transition-all hover:-translate-y-1 hover:shadow-white/30 cursor-pointer"
  >
    <div className="flex flex-col items-center">
      <h2 className="text-base font-semibold truncate">{note.title}</h2>

      <p className="text-sm text-gray-300 line-clamp-4">{note.content}</p>
    </div>
    <p className="text-xs text-gray-400 mb-2">
      {showFormattedDate(note.created_at)}
    </p>
  </div>
);

const NoteList = ({ notes, onNoteClick }) => (
  <section className="w-full max-w-6xl mx-auto py-10 px-4">
    <h2 className="flex items-center gap-2 text-2xl font-semibold mb-10 text-white">
      <img src="/note.svg" alt="note icon" className="w-7 h-7 invert" />
      Notes
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {notes.length > 0 ? (
        notes.map((note) => (
          <NoteItem key={note.id} note={note} onClick={onNoteClick} />
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          No Notes Found
        </p>
      )}
    </div>
  </section>
);

// POPUP DETAIL NOTE
// POPUP DETAIL NOTE
const NoteDetailModal = ({ note, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-[#0a0a0a] w-full max-w-lg p-6 shadow-lg max-h-[85vh] flex flex-col border-1 border-[#333333]">
        {isEditing ? (
          <>
            <input
              className="w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 p-2 mb-3"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 p-2 h-[200px] mb-4 resize-none"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex justify-between gap-3 mt-auto">
              <button
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                onClick={() => {
                  onUpdate(note.id, editTitle, editContent);
                  setIsEditing(false);
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-1">{note.title}</h2>
            <p className="text-gray-400 text-sm mb-3">
              {showFormattedDate(note.created_at)}
            </p>

            {/* Konten scrollable */}
            <div className="text-gray-200 whitespace-pre-line mb-6 overflow-y-auto pr-2 custom-scrollbar max-h-[55vh]">
              {note.content}
            </div>

            <div className="flex justify-between gap-3 mt-auto">
              <button
                className="flex-1 bg-[#0a0a0a] hover:border-yellow-300 text-white py-2 border-[#333333] border-1 transition-all ease-in-out duration-300"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="flex-1 bg-[#0a0a0a] hover:border-red-500 text-white py-2 border-[#333333] border-1 transition-all ease-in-out duration-300"
                onClick={() => onDelete(note.id)}
              >
                Delete
              </button>
              <button
                className="flex-1 bg-[#0a0a0a] hover:border-white text-white py-2 border-[#333333] border-1 transition-all ease-in-out duration-300"
                onClick={onClose}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper
const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};
