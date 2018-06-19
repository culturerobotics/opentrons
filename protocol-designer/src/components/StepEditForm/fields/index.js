// @flow
import * as React from 'react'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {actions, selectors, getFieldErrors, processField} from '../../steplist' // TODO use steplist/index.js
import type {FormData, StepType} from '../../../form-types'
import type {BaseState, ThunkDispatch} from '../../types'

type FieldRenderProps = {
  value: string,
  updateField: (mixed) => void,
  errorsToShow: {[string]: string} // TODO: real field errors type
}
type OP = {
  name: string, // TODO: real type
  render: (FieldRenderProps) => StepField,
  maskValue?: (mixed) => mixed,
  dirtyFields?: Array<string>, // TODO: real type
  focusedField?: string // TODO: real type
}
type SP = {value: $Values<F>}
type DP = {updateValue: (e: SyntheticInputEvent<*>) => mixed}

const StepField = (props): StepFieldProps => {
  const {
    name,
    render,
    value,
    updateValue,
    focusedField,
    dirtyFields
  } = props
  const showErrors = !(name === focusedField) && dirtyFields.includes(name)
  const processedValue = processField(name, value)
  const errors = getFieldErrors(name, processedValue)
  // if (isRequired && isEmpty(value)) {
  //   errors = {...errors, REQUIRED_FIELD: 'This field is required'}
  // }
  return render({
    value,
    updateField: (rawValue) => updateValue(processedValue),
    errorsToShow: showErrors && errors
  })
}

const STP = (state: BaseState, ownProps: OP): SP => ({
  value: selectors.formData(state)[ownProps.fieldName] || ''
})

const DTP = (dispatch: ThunkDispatch<*>, ownProps: OP): DP => ({
  updateValue: (value: mixed) => {
    dispatch(actions.changeFormInput({update: {[ownProps.fieldName]: value}}))
  }
})

const ConnectedStepField = connect(STP, DTP)(StepField)

export default ConnectedStepField
