import useSWR from 'swr';
import { object, string } from 'yup';
import useFlash from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import getPlugins, { Plugin } from '@/api/server/plugins/getPlugins';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import Plugin from '@/api/server/plugins/Plugin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt, faExternalLinkAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

interface Values {
    query: string;
}

export default () => {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const { clearFlashes, addFlash, clearAndAddHttpError } = useFlash();
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);

    const { data, error } = useSWR<Plugin>([uuid, query, '/plugins'], (uuid, query) => getPlugins(uuid, query));

    useEffect(() => {
        if (!error) {
            clearFlashes('server:plugins');
        } else {
            clearAndAddHttpError({ key: 'server:plugins', error });
        }
    }, [error]);

    const submit = ({ query }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        setQuery(query);
        setSubmitting(false);
    };

    const doDownload = (id: number) => {
        console.log('Installing plugin with ID ' + id);
        installPlugin(uuid, id)
            .then(() => setOpen(false))
            .then(() =>
                addFlash({
                    key: 'server:plugins',
                    type: 'success',
                    message: 'Plugin installed successfully.',
                })
            )
            .catch((error) => clearAndAddHttpError(error));
    };

    return (
        <ServerContentBlock title={'Plugins'}>
            <FlashMessageRender byKey={'server:plugins'} />
            <Formik
                onSubmit={submit}
                initialValues={{ query: '' }}
                validationSchema={object().shape({
                    query: string().required(),
                })}
            >
                <Form>
                    <div className={'grid grid-cols-12 mb-10'}>
                        <div className={'col-span-11 mr-4'}>
                            <Field
                                className={'p-2 bg-gray-600 w-full rounded'}
                                name={'query'}
                                placeholder={'Type to search...'}
                            />
                        </div>
                        <Button type={'submit'}>
                            Search <FontAwesomeIcon icon={faSearch} className={'ml-1'} />
                        </Button>
                    </div>
                </Form>
            </Formik>
            {!data ? null : (
                <>
                    {!data.plugins ? (
                        <p className={'text-gray-400 text-center'}>Waiting for a search query to be provided...</p>
                    ) : (
                        <>
                            {data.plugins.length < 1 ? (
                                <p>Couldn&apos;t find any plugins.</p>
                            ) : (
                                <div className={'lg:grid lg:grid-cols-3 p-2'}>
                                    {data.plugins.map((plugin, key) => (
                                        <>
                                            <Dialog.Confirm
                                                open={open}
                                                onClose={() => setOpen(false)}
                                                title={'Plugin Installation'}
                                                onConfirmed={() => doDownload(plugin.id)}
                                            >
                                                Are you sure you wish to download this plugin?
                                            </Dialog.Confirm>
                                            <TitledGreyBox title={plugin.name} key={key} className={'m-2'}>
                                                <div className={'lg:grid lg:grid-cols-5'}>
                                                    <div className={'lg:col-span-4'}>
                                                        <p className={'text-sm'}>{plugin.tag}</p>
                                                        <p className={'text-xs text-gray-400'}>
                                                            {`https://api.spiget.org/v2/resources/${plugin.id}/go`}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Button className={'m-1'} onClick={() => setOpen(true)}>
                                                            <FontAwesomeIcon icon={faCloudDownloadAlt} fixedWidth />
                                                        </Button>
                                                        <a href={`https://api.spiget.org/v2/resources/${plugin.id}/go`} target="_blank">
                                                            <Button className={'m-1'}>
                                                                <FontAwesomeIcon icon={faExternalLinkAlt} fixedWidth />
                                                            </Button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </TitledGreyBox>
                                        </>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </ServerContentBlock>
    );
};
