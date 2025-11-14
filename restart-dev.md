# Reiniciar Servidor de Desarrollo

Para aplicar los cambios de configuración de Next.js (especialmente la configuración de imágenes), necesitas reiniciar el servidor de desarrollo:

## Pasos:

1. **Detener el servidor actual**:
   - Presiona `Ctrl + C` en la terminal donde está corriendo `npm run dev`

2. **Reiniciar el servidor**:
   ```bash
   npm run dev
   ```

3. **Verificar que funcione**:
   - Ve a `http://localhost:3000/tienda`
   - Las imágenes de Cloudflare R2 deberían cargar correctamente

## Configuración Aplicada:

- ✅ Dominio específico de Cloudflare R2: `pub-e29c0247fb7649ce98590df7640d058a.r2.dev`
- ✅ Patrón genérico para R2: `*.r2.dev`
- ✅ Dominios de producción: `surequinos.com` y `*.surequinos.com`
- ✅ Componente OptimizedImage con manejo de errores y fallbacks

## Si persisten problemas:

1. Verifica que el dominio en la configuración coincida exactamente con el de tus imágenes
2. Revisa la consola del navegador para errores específicos
3. Asegúrate de que las URLs de las imágenes sean accesibles directamente en el navegador