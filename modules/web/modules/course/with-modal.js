// @flow
import React from 'react'
import ModalCourse from './modal'
import CompactCourse from './compact'

type State = {
    isOpen: boolean,
}

export default class CourseWithModal extends React.PureComponent<{}, State> {
    state = { isOpen: false }
    closeModal = () => this.setState(() => ({ isOpen: false }))
    openModal = () => this.setState(() => ({ isOpen: true }))

    render() {
        return (
            <div>
                <CompactCourse onClick={this.openModal} {...this.props} />
                {this.state.isOpen && (
                    <ModalCourse onClose={this.closeModal} {...this.props} />
                )}
            </div>
        )
    }
}
