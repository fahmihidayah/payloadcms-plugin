import type { AdminViewServerProps, ServerProps } from 'payload'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { redirect } from 'next/navigation.js'
// import { getSafeRedirect } from '@payload/shared'
import React, { Fragment } from 'react'

import { LoginForm } from './LoginForm/index.js'
import './index.scss'
import { Logo } from 'src/elements/Logo/index.jsx'
import { getSafeRedirect } from 'src/utilities/getSafeRedirect.js'
export const loginBaseClass = 'login'

export function LoginView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { locale, permissions, req } = initPageResult

  const {
    i18n,
    payload: { config },
    payload,
    user,
  } = req

  const {
    admin: { components: { afterLogin, beforeLogin } = {}, user: userSlug },
    routes: { admin },
  } = config

  const redirectUrl = getSafeRedirect({ fallbackTo: admin, redirectTo: searchParams?.redirect ?? "/admin" })

  if (user) {
    redirect(redirectUrl)
  }

  const collectionConfig = payload?.collections?.[userSlug]?.config

  const prefillAutoLogin =
    typeof config.admin?.autoLogin === 'object' && config.admin?.autoLogin.prefillOnly

  const prefillUsername =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.username
      : undefined

  const prefillEmail =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.email
      : undefined

  const prefillPassword =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.password
      : undefined

  return (
    <Fragment>
      <div className={`${loginBaseClass}__brand`}>
        <p>Custom Login</p>
        <Logo
          i18n={i18n}
          locale={locale}
          params={params}
          payload={payload}
          permissions={permissions}
          searchParams={searchParams}
          user={user ?? undefined}
        />
      </div>
      {RenderServerComponent({
        Component: beforeLogin,
        importMap: payload.importMap,
        serverProps: {
          i18n,
          locale,
          params,
          payload,
          permissions,
          searchParams,
          user : user ?? undefined,
        } satisfies ServerProps,
      })}
      {!collectionConfig?.auth?.disableLocalStrategy && (
        <LoginForm
          prefillEmail={prefillEmail}
          prefillPassword={prefillPassword}
          prefillUsername={prefillUsername}
          searchParams={searchParams as  { [key: string]: string | string[] | undefined }}
        />
      )}
      {RenderServerComponent({
        Component: afterLogin,
        importMap: payload.importMap,
        serverProps: {
          i18n,
          locale,
          params,
          payload,
          permissions,
          searchParams,
          user : user ?? undefined,
        } satisfies ServerProps,
      })}
    </Fragment>
  )
}
