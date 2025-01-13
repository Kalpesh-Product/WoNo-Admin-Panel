import React from 'react'
import WidgetSection from '../../components/WidgetSection'

const ManageTickets = () => {

  const widgets = {

  }
  return (
 <div>
      <div>
        {widgets.map((widget, index) => (
          <div>
            <WidgetSection key={index} layout={widget.layout}>
              {widget?.widgets}
            </WidgetSection>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageTickets
