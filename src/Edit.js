import React, { useState, useEffect } from 'react';
import './Edit.css';
import { useNavigate, useParams } from 'react-router-dom';
import fireDb from './firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  name: '',
  email: '',
  contact: '',
  picture: '',
};

const Edit = () => {
  const [state, setState] = useState(initialState);
  const [data, setData] = useState({});
  const { name, email, contact, picture } = state;
  const [previewURL, setPreviewURL] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fireDb.child('contacts').on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        setData({ ...snapshot.val() });
      } else {
        setData({});
      }
    });
    return () => {
      setData({});
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      setState({ ...data[id], picture: '' });
      setPreviewURL(data[id]?.picture);
    } else {
      setState({ ...initialState });
    }
  }, [id, data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Please provide the Name');
    } else {
      if (state.picture && state.picture instanceof File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const contactData = {
            name,
            email,
            contact,
            picture: event.target.result, // Store the Base64-encoded image string in the database
          };

          if (!id) {
            fireDb
              .child('contacts')
              .push(contactData)
              .then(() => {
                toast('Contact Added successfully');
                setTimeout(() => navigate('/'), 500);
              })
              .catch((error) => {
                toast.error(error.message);
              });
          } else {
            fireDb
              .child(`contacts/${id}`)
              .set(contactData)
              .then(() => {
                toast('Contact Updated successfully');
                setTimeout(() => navigate('/'), 500);
              })
              .catch((error) => {
                toast.error(error.message);
              });
          }
        };

        reader.readAsDataURL(state.picture);
      } else {
        // If no new image selected, update contact without modifying the picture
        const contactData = {
          name,
          email,
          contact,
          picture: data[id]?.picture || '', // Use the existing picture URL if no new picture is selected
        };

        if (!id) {
          fireDb
            .child('contacts')
            .push(contactData)
            .then(() => {
              toast('Contact Added successfully');
              setTimeout(() => navigate('/'), 500);
            })
            .catch((error) => {
              toast.error(error.message);
            });
        } else {
          fireDb
            .child(`contacts/${id}`)
            .set(contactData)
            .then(() => {
              toast('Contact Updated successfully');
              setTimeout(() => navigate('/'), 500);
            })
            .catch((error) => {
              toast.error(error.message);
            });
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'picture') {
      setState({ ...state, picture: files[0] });
      setPreviewURL(URL.createObjectURL(files[0]));
    } else {
      setState({ ...state, [name]: value });
    }
  };

  return (
    <div className="edit">
      <form className="edit_form">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name.... "
          value={name}
          onChange={handleInputChange}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Your Email.... "
          value={email}
          onChange={handleInputChange}
        />
        <label htmlFor="contact">Contact</label>
        <input
          type="number"
          id="contact"
          name="contact"
          placeholder="Your Contact No.... "
          value={contact}
          onChange={handleInputChange}
        />
        <label htmlFor="picture">Picture</label>
        <input
          type="file"
          id="picture"
          name="picture"
          onChange={handleInputChange}
        />
        {previewURL && <img src={previewURL} alt="Preview" />}
        <button onClick={handleSubmit}>{id ? 'Update' : 'Save'}</button>
      </form>
    </div>
  );
};

export default Edit;
