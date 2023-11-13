const base: string | undefined = process.env.NEXT_PUBLIC_API_HOSTNAME || "http://localhost:3000";

type sendProps = {
  method: string;
  path: string;
  data?: object;
  token?: string;
};

async function send({ method, path, data, token }: sendProps) {
  const opts: RequestInit = { method, headers: new Headers(), cache: "no-cache" };

  if (data) {
    // @ts-ignore
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(data);
  }

  if (token) {
    // @ts-ignore
    opts.headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(base + path, opts);

  if (res.status === 404) throw new Error(`${res.status}: ${res.statusText}`);
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

  return res.json();
}

export function get(path: string, token?: string) {
  return send({ method: "GET", path, token });
}

export function del(path: string, token?: string) {
  return send({ method: "DELETE", path, token });
}

export function post(path: string, data: object, token?: string) {
  return send({ method: "POST", path, data, token });
}

export function put(path: string, data: object, token?: string) {
  return send({ method: "PUT", path, data, token });
}

export function patch(path: string, data: object, token?: string) {
  return send({ method: "PATCH", path, data, token });
}
