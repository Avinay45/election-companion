
-- Already set on most; this is belt-and-suspenders for any that might be missing
ALTER FUNCTION public.has_role(UUID, public.app_role) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.match_kb_chunks(vector, INT, TEXT) SET search_path = public;
