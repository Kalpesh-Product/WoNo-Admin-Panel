import React from 'react'

const PrimaryButton = ({title, handleSubmit, type, fontSize, externalStyles}) => {
  return (
    <div>
      <button type={type} className={`px-8 py-2 motion-preset-slide-up-sm bg-primary text-white rounded-md ${fontSize ? fontSize : "text-content leading-5" } ${externalStyles}`} onClick={handleSubmit}>
        {title}
      </button>
    </div>
  )
}

export default PrimaryButton
