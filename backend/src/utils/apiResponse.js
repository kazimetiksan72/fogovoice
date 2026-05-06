export const ok = (res, data = null, message = 'OK') => res.json({ success: true, message, data });
export const created = (res, data = null, message = 'Created') => res.status(201).json({ success: true, message, data });
