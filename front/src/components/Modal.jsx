import React, { useEffect, useState } from 'react';
import {
  TERipple,
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
} from 'tw-elements-react';

const Modal = ({ header, errors, identifier, showModal, toggleModal, onSubmit, children }) => {
  const [show, setShow] = useState(showModal);

  useEffect(() => {
    setShow(showModal);
  }, [showModal]);

  const handleOutsideClick = (event) => {
    const modalContent = document.getElementById('modal-content' + identifier);
    if (show && modalContent && !modalContent.contains(event.target)) {
      toggleModal(false);
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [show, toggleModal]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div>
      <TEModal show={show}>
        <TEModalDialog>
          <TEModalContent id={`modal-content${identifier}`} className='p-3'>
            <TEModalHeader>
              <h2>{header}</h2>
            </TEModalHeader>
            {errors && Object.keys(errors).map((field, index) => (
              <span key={index} className='text-red-600'>
                {errors[field]}
              </span>
            ))}
            {children}
            <TEModalFooter>
              <TERipple rippleColor="light">
                <button
                  type="button"
                  className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                  onClick={() => toggleModal(false)}
                >
                  Close
                </button>
              </TERipple>
              <TERipple rippleColor="light">
                <button
                  type="button"
                  className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  onClick={handleSubmit}
                >
                  Save changes
                </button>
              </TERipple>
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
};

export default Modal;
