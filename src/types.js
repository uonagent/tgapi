/* @flow */

import { Observable, Subject } from 'rxjs'

import type {
  Update,
  Message,
  InlineQuery,
  ChosenInlineResult,
  CallbackQuery,
  ShippingQuery,
  PreCheckoutQuery,
} from './generatedTypes'

export type UpdateProp = (
  'message' | 'edited_message' | 'channel_post' | 'edited_channel_post' |
  'inline_query' | 'chosen_inline_result' |
  'callback_query' | 'shipping_query' | 'pre_checkout_query'
)

export type MessageUpdate = { update_id: number, message: Message }
export type EditedMessageUpdate = { update_id: number, edited_message: Message }
export type ChannelPostUpdate = { update_id: number, channel_post: Message }
export type EditedChannelPostUpdate = { update_id: number, edited_channel_post: Message }
export type InlineQueryUpdate = { update_id: number, inline_query: InlineQuery }
export type ChosenInlineResultUpdate =
  { update_id: number, chosen_inline_result: ChosenInlineResult }
export type CallbackQueryUpdate = { update_id: number, callback_query: CallbackQuery }
export type ShippingQueryUpdate = { update_id: number, shipping_query: ShippingQuery }
export type PreCheckoutQueryUpdate = { update_id: number, pre_checkout_query: PreCheckoutQuery }

export interface UpdateHandler {
    emit: (update: Update) => mixed,

    update$: Subject<Update>,

    message$: Observable<MessageUpdate>,
    editedMessage$: Observable<EditedMessageUpdate>,
    channelPost$: Observable<ChannelPostUpdate>,
    editedChannelPost$: Observable<EditedChannelPostUpdate>,
    inlineQuery$: Observable<InlineQueryUpdate>,
    chosenInlineResult$: Observable<ChosenInlineResultUpdate>,
    callbackQuery$: Observable<CallbackQueryUpdate>,
    shippingQuery$: Observable<ShippingQueryUpdate>,
    preCheckoutQuery$: Observable<PreCheckoutQueryUpdate>,
}

export type SpecRawType = {
  name: string,
  description: string[],
  fieldsData: string[][],
  fieldHeaders: string[],
}

export type SpecRawUnion = {
  name: string,
  description: string[],
  types: string[],
}

export type SpecRaw = {
  types: SpecRawType[],
  unions: SpecRawUnion[],
}

export type MethodSpec = {
  type: 'method',
  name: string,
  description: string[],
  fields: Array<{
    parameters: string,
    type: string,
    required: string,
    description: string,
  }>,
}

export type TypeSpecField = {
  field: string,
  type: string,
  description: string,
}

export type TypeSpec = {
  type: 'typedef',
  name: string,
  description: string[],
  fields: TypeSpecField[],
}

export type UnionSpec = {
  type: 'union',
  name: string,
  description: string[],
  types: string[],
}

export type UnknownSpec = {
  type: 'unknown',
  name: string,
  description: string[],
  fields: Array<{
    [key: string]: string,
  }>,
}

export type Spec = (
  MethodSpec |
  TypeSpec |
  UnionSpec |
  UnknownSpec
)
