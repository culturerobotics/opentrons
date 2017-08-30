// robot actions and action types
// action helpers
import {makeActionName} from '../util'
import NAME from './name'

const makeRobotActionName = (action) => makeActionName(NAME, action)
const makeRobotAction = (action) => ({...action, meta: {robotCommand: true}})

export const actionTypes = {
  // requests and responses
  CONNECT: makeRobotActionName('CONNECT'),
  CONNECT_RESPONSE: makeRobotActionName('CONNECT_RESPONSE'),
  SESSION: makeRobotActionName('SESSION'),
  SESSION_RESPONSE: makeRobotActionName('SESSION_RESPONSE'),
  HOME: makeRobotActionName('HOME'),
  HOME_RESPONSE: makeRobotActionName('HOME_RESPONSE'),
  RUN: makeRobotActionName('RUN'),
  RUN_RESPONSE: makeRobotActionName('RUN_RESPONSE'),
  PAUSE: makeRobotActionName('PAUSE'),
  PAUSE_RESPONSE: makeRobotActionName('PAUSE_RESPONSE'),
  RESUME: makeRobotActionName('RESUME'),
  RESUME_RESPONSE: makeRobotActionName('RESUME_RESPONSE'),
  CANCEL: makeRobotActionName('CANCEL'),
  CANCEL_RESPONSE: makeRobotActionName('CANCEL_RESPONSE'),

  // instantaneous state
  // TODO(mc, 2017-08-23): consider combining set commands and set protocol
  // error into a single newSessionResponse action
  SET_COMMANDS: makeRobotActionName('SET_COMMANDS'),
  SET_PROTOCOL_ERROR: makeRobotActionName('SET_PROTOCOL_ERROR'),
  TICK_CURRENT_COMMAND: makeRobotActionName('TICK_CURRENT_COMMAND')
}

export const actions = {
  // TODO(mc): connect should take a URL or robot identifier
  connect () {
    return makeRobotAction({type: actionTypes.CONNECT})
  },

  connectResponse (error = null) {
    return {type: actionTypes.CONNECT_RESPONSE, error}
  },

  // get session or make new session with protocol file
  session (file = null) {
    return makeRobotAction({type: actionTypes.SESSION, payload: {file}})
  },

  sessionResponse (error = null, session = null) {
    return {type: actionTypes.SESSION_RESPONSE, payload: {session}, error}
  },

  home (axes) {
    const action = makeRobotAction({type: actionTypes.HOME})
    if (axes != null) action.payload = {axes}

    return action
  },

  homeResponse (error = null) {
    return {type: actionTypes.HOME_RESPONSE, error}
  },

  run () {
    return makeRobotAction({type: actionTypes.RUN})
  },

  runResponse (error = null) {
    return {type: actionTypes.RUN_RESPONSE, error}
  },

  pause () {
    return makeRobotAction({type: actionTypes.PAUSE})
  },

  pauseResponse (error) {
    return {type: actionTypes.PAUSE_RESPONSE, error}
  },

  resume () {
    return makeRobotAction({type: actionTypes.RESUME})
  },

  resumeResponse (error) {
    return {type: actionTypes.RESUME_RESPONSE, error}
  },

  cancel () {
    return {type: actionTypes.CANCEL}
  },

  cancelResponse (error) {
    return {type: actionTypes.CANCEL_RESPONSE, error}
  },

  setCommands (commands) {
    return {type: actionTypes.SET_COMMANDS, payload: {commands}}
  },

  setProtocolError (error) {
    return {type: actionTypes.SET_PROTOCOL_ERROR, error}
  },

  tickCurrentCommand () {
    return {type: actionTypes.TICK_CURRENT_COMMAND}
  }
}
