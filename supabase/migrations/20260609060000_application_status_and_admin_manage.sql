-- Coluna de status (pendente/aprovado/reprovado) nas inscrições
alter table public.applications
  add column if not exists status text not null default 'pendente'
  check (status in ('pendente', 'aprovado', 'reprovado'));

-- Permitir que admins editem (status) e excluam inscrições
grant update, delete on public.applications to authenticated;

create policy "Admins can update applications" on public.applications
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete applications" on public.applications
  for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
